import {SecretManagerServiceClient} from "@google-cloud/secret-manager";
/**
 * Wrapper class over secretManager api
 */
class SecretsReader {
  /**  Ensures we authenticate as our service account in an encrypted way*/
  SecretManagerServiceClient: SecretManagerServiceClient;
  GOOGLE_CLOUD_PROJECT: string;

  /** Creates a new serviceClient for secret manager */
  constructor() {
    this.SecretManagerServiceClient = new SecretManagerServiceClient();
    /** stores ref to GCloudProject,
     *  set by app engine, and probably other cloud envs*/
    this.GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT ?? "";
  }
  /**
   * Gets the value of a secret at a version
   * @param {string} secret
   * @param {string} version
   * */
  async getSecretValue(secret: string, version = "latest"): Promise<string> {
    // Resource path or uri. Equal to the Resource name.
    const req = {
      name: `projects/${this.GOOGLE_CLOUD_PROJECT}/secrets/`
          .concat(`${secret}/versions/${version}`),
    };
    // Call
    const [vs] = await this.SecretManagerServiceClient.accessSecretVersion(req);
    const payload = vs.payload?.data?.toString();
    if (!payload) throw new Error("No payload received");
    return payload;
  }
}

export {SecretsReader};
