```ts
// For when we have jest.
// Place mockGConnect here.
// import { randomBytes } from 'crypto';
// const mockGConnect = async (_dbString: string,_sessionSecret: string)=> {
//     const {DB_STRING,SESSION_SECRET} = process.env;
//     // sleep for 1s.
//     await new Promise((res)=>setTimeout(res,1000))
//     // Testing. 
//     if (!DB_STRING) throw new Error('Secrets not defined');
//     _dbString = DB_STRING;
//     _sessionSecret = SESSION_SECRET ?? randomBytes(32).toString();
// }
// export {mockGConnect};
```