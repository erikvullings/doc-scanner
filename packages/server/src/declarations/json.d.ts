declare module "package.json" {
  const content: {
    name: string;
    version: string;
    license: string;
    description: string;
  };
  export default content;
}
