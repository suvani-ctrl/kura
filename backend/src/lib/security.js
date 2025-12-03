import { createHash } from "node:crypto";


export async function isPwned(password) {
  const sha1 = createHash("sha1").update(password).digest("hex").toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);
  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const text = await res.text();
  return text.split("\n").some(line => line.split(":")[0].trim() === suffix);
}


export default isPwned