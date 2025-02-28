// export { GET, POST } from 'auth';


import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "lib/auth";

export const { POST, GET } = toNextJsHandler(auth);