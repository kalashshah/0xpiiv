import { polygonMumbai } from "wagmi/chains";

export const ETH_CHAINS = [polygonMumbai];
export const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";

export const SITE_NAME = "0xpiiv";
export const SITE_DESCRIPTION =
  "Some description for the site. This will be used for SEO purposes.";
export const SITE_URL = "https://0xpiiv.vercel.app";

export const SOCIAL_TWITTER = "kalashshah04";
export const SOCIAL_GITHUB = "kitai-hazure/0xpiiv";

export const NFT_CONTRACT_ADDRESS =
  "0x0Fc5f8A784810dEd101BD734cC59F6F7b868A3AF";

export const ironOptions = {
  cookieName: SITE_NAME,
  password:
    process.env.SESSION_PASSWORD ??
    "set_a_complex_password_at_least_32_characters_long",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
