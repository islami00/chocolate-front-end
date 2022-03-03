import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
class SecretsReader {
  // Ensures we authenticate as our service account in an encrypted way
  SecretManagerServiceClient: SecretManagerServiceClient;
  GOOGLE_CLOUD_PROJECT: string;

  constructor() {
    this.SecretManagerServiceClient = new SecretManagerServiceClient();
    this.GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT ?? ""; // set by app engine, and probably other cloud envs
  }
  /**Gets the value of a secret at a version */
  async GetSecretValue(secret: string, version = "latest") {
    // Resource path or uri. Equal to the Resource name.
    const req = {
      name: `projects/${this.GOOGLE_CLOUD_PROJECT}/secrets/${secret}/versions/${version}`,
    };
    // Call
    const [vs] = await this.SecretManagerServiceClient.accessSecretVersion(req);
    const payload = vs.payload?.data?.toString();
    if (!payload) throw new Error("No payload received");
    return payload;
  }
}

export { SecretsReader };
