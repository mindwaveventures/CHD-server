export { }

declare global {
    namespace Express {
        interface Request {
            userid: string;
            id: string;
            usertype: string;
            trustId: string;
        }
    }
}