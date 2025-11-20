

export interface IauthService {
    verify(token: string, data: string): Promise<string>;
}

export class AuthService implements IauthService {
    async verify(token: string, data: string): Promise<string> {
        const res = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, data }),
        })
        const json = await res.json();
         return json.message;
    }
    
   
}