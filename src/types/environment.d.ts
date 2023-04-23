declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PORT: string;
        NODE_ENV: 'development' | 'production';
        MONGO_URI: string
      }
    }
}
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}