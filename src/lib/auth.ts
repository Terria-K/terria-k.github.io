import jwt from "jsonwebtoken";

export async function verifyToken(request: Request): Promise<boolean | string> {
    const bearerHeader = request.headers.get("authorization");

    if (!bearerHeader) {
        return false;
    }

    const bearerToken = bearerHeader.split(" ")[1];
    return bearerToken;
}

export async function jwtSign(payload: string | Object | Buffer, secret: string): Promise<{token: string}> {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, { expiresIn: '1d'}, (err: Error | null, token: string | undefined) => {
            if (err) {
                return reject(err);
            }
            const jsonToken = {
                token
            };
            return resolve(jsonToken as { token: string });
        })
    })
}

export async function jwtVerify(token: string, secret: string): Promise<string | jwt.JwtPayload> {
    return new Promise((resolve, reject) => {
        const verify = jwt.verify(token, secret);
        if (!verify) {
            return reject(403)
        }
        return resolve(verify);
    })
}