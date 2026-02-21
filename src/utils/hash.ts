export const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // SHA-256 for a Cloudflare Worker compatible simple hash.
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert ArrayBuffer to Hex String
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    const attemptedHash = await hashPassword(password);
    return attemptedHash === hash;
};
