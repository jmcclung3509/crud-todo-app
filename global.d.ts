declare global {
    namespace NodeJS {
        interface ProcessEnv {
             PORT?: string;
             NODE_ENV: 'development',
             MONGO_URI: string;
        }
    }
}

export {};