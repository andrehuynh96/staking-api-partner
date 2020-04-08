// nvm use v12.7.0
const jose = require("@panva/jose");
const {
  JWE, // JSON Web Encryption (JWE)
  JWK, // JSON Web Key (JWK)
  JWKS, // JSON Web Key Set (JWKS)
  JWS, // JSON Web Signature (JWS)
  JWT, // JSON Web Token (JWT)
  errors // errors utilized by @panva/jose
} = jose;

// let key = jose.JWK.generateSync("RSA", 2048, { use: "sig", alg: "HS256" });
// console.log("----------------JWK-----------------");
// console.log(key.toJWK());
// console.log("----------------PEM-----------------");
// console.log(key.toPEM(), key.toPEM(true));

/*
----------------JWK-----------------
{
  e: 'AQAB',
  n: 'sayjGLpcrtNoD6mv8QNIv88G6HLGzJG2bnIsxJTckTfaonppa2BfIH6ZMrgv5ngpoYVb3ZjGHVTmQlNCZ2t6hhKI5vbMdIYr4K1cRiO-JvH93v57QL627O6f-FR-xVQVvaIlcd3S5q0T-sY2gYlNBzOWfJCGjIU_xONtbf0naO1KuBddliQ5mEM7a11l71kZvQIMRJs-djohmYH3QcnVY33rWdU4lVOuIWP7hyft_FdsSNQBRnb_yB_geo6GMyV-TWzP-NizHzIUq7_g3ixYR-Sp7815m-GYZSM4G2zps2Lkrrz9SwzZj6y_Z--NLaLm3K_MKHKyy29089tU7fpE-w',
  kty: 'RSA',
  kid: 'oanwHvlsvgyZcNuqlWJtBCX7N3H2y2XNm7wze2308xI',
  alg: 'HS256',
  use: 'sig'
}
----------------PEM-----------------
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsayjGLpcrtNoD6mv8QNI
v88G6HLGzJG2bnIsxJTckTfaonppa2BfIH6ZMrgv5ngpoYVb3ZjGHVTmQlNCZ2t6
hhKI5vbMdIYr4K1cRiO+JvH93v57QL627O6f+FR+xVQVvaIlcd3S5q0T+sY2gYlN
BzOWfJCGjIU/xONtbf0naO1KuBddliQ5mEM7a11l71kZvQIMRJs+djohmYH3QcnV
Y33rWdU4lVOuIWP7hyft/FdsSNQBRnb/yB/geo6GMyV+TWzP+NizHzIUq7/g3ixY
R+Sp7815m+GYZSM4G2zps2Lkrrz9SwzZj6y/Z++NLaLm3K/MKHKyy29089tU7fpE
+wIDAQAB
-----END PUBLIC KEY-----
 -----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCxrKMYulyu02gP
qa/xA0i/zwbocsbMkbZucizElNyRN9qiemlrYF8gfpkyuC/meCmhhVvdmMYdVOZC
U0Jna3qGEojm9sx0hivgrVxGI74m8f3e/ntAvrbs7p/4VH7FVBW9oiVx3dLmrRP6
xjaBiU0HM5Z8kIaMhT/E421t/Sdo7Uq4F12WJDmYQztrXWXvWRm9AgxEmz52OiGZ
gfdBydVjfetZ1TiVU64hY/uHJ+38V2xI1AFGdv/IH+B6joYzJX5NbM/42LMfMhSr
v+DeLFhH5KnvzXmb4ZhlIzgbbOmzYuSuvP1LDNmPrL9n740toubcr8wocrLLb3Tz
21Tt+kT7AgMBAAECggEAc2bFPH93SZpIgbveajWO3/6Q5xP9qcuO6afBCiICLVRQ
7q2BoVukDdAMo1Pc0N4FdELRS1o6e7y0HipD/DZkC4coYpO0co7fGvye7XOzw0n0
cg1qcsAswjGvt7Tx7itSP6x8k7vXizqpun1Z08MhQ+cu/FNHAShfJfvuDL2cBlrc
j3Ds7tOVQpiPGQTHLbc4/uFeoazuxaw9vvldTansIx1+FFcr8tL4WEUnEjBV3JmC
ZyywFAK71sHrgKSiEi0tGROORAWjKAyk0LopUgk067/H8b9Aq8J34ZNGU5Ga0O21
ZyxopBvRXcFx03kGDEVR3UZYQztIkMogg2FtxVftwQKBgQDfZ6ANrxd7fzxIsR7m
/jawZf7ulHt2tdbPuzf7zbF+r6aN2VZfFJZFDXE9bq+KIc7GxZKUAnxDpKa4J30+
lvWJr3Wj0gl62KM8KKlQJhR7BYiGySrT2qQPkp/vofvbh1v7I3v5pKOShgIEzsQm
dzHV6qk1UTd5lgG3nxc46DXioQKBgQDLmPA9h/bt2SWiOFE/GY719bJYHsXyHF9t
Gsom56K3lSRLuCqBwgjvEclC+VO775ALNlE674+1tm2RHzUhlZzLz2pEa7sk0/xN
X/RHaBv1ynELQoucdQFlaU1X/E09SGd1ts8PqbptntWhLvZcNdpjsGrPYytAWltV
szLxAuyeGwKBgQCAf9pQBKY9IrJKHZboxtAuJny8PivF3FHyqn1JGMc/V0k1zg0g
I3dLwK+h5kiR62BEdOAawlM3lT1QL2aa2bnhuEqyL93EC1fZAopgz4Z4PHaLEKrR
sLEtQ+k6rLFxVCpUCdUFgu2TGgGPQl8QwP6pTJCHWm/OP7o9JAT3dpmIAQKBgQCI
ko0FGYGgxzsheFm31DM79pat2ea6pCG3FHNqaZOTRm5UhLOu2zQW+n1hedKbjPW5
L7SJrk1efYM+CAsh/jRx2y7TutiMuc7TMHyysbmfxS7TeM4iI7LODjcdwFcntrwA
EKMRRK+T/Soct133OQDIQn1DpKhMwM/nyw9u8KE85QKBgHcY9KUSMCAxZ5h9ZHSk
mcBx5A36tvem28FGixo1DOUqSwRMeniQObcfgA1YFFo5Ws9E47xDRfpnPiHhfgJt
t8zsRyd17JWU0ZSbvA3jqeIa4yFNXWWA7wn//Fqnh60hnqnvrDLreNY7mx6Jrfkw
GNCnPgeODhLOhuuVxWzKyvnO
-----END PRIVATE KEY-----
*/

let keys = [
  {
    e: "AQAB",
    n:
      "sayjGLpcrtNoD6mv8QNIv88G6HLGzJG2bnIsxJTckTfaonppa2BfIH6ZMrgv5ngpoYVb3ZjGHVTmQlNCZ2t6hhKI5vbMdIYr4K1cRiO-JvH93v57QL627O6f-FR-xVQVvaIlcd3S5q0T-sY2gYlNBzOWfJCGjIU_xONtbf0naO1KuBddliQ5mEM7a11l71kZvQIMRJs-djohmYH3QcnVY33rWdU4lVOuIWP7hyft_FdsSNQBRnb_yB_geo6GMyV-TWzP-NizHzIUq7_g3ixYR-Sp7815m-GYZSM4G2zps2Lkrrz9SwzZj6y_Z--NLaLm3K_MKHKyy29089tU7fpE-w",
    kty: "RSA",
    kid: "oanwHvlsvgyZcNuqlWJtBCX7N3H2y2XNm7wze2308xI",
    alg: "HS256",
    use: "sig"
  }
];

let jwks = JWKS.asKeyStore({ keys: keys });
console.log(jwks.all()[0].toPEM());
