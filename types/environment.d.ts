/** biome-ignore-all lint/correctness/noUnusedVariables: Used for `process.env` */
/** biome-ignore-all lint/style/useNamingConvention: Used for `process.env` */

namespace NodeJS {
	interface ProcessEnvironment {
		WEBHOOK_ODESLI: string | undefined;
		WEBHOOK_SPICEY_LA_VICEY: string | undefined;
	}
}
