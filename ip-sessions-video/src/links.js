/**
 * Links out of this prototype.
 *
 * The two prototypes are separate deployments, so crossing between them is an
 * absolute URL rather than a route. In dev these point at the published site,
 * which is the honest thing: there is no local copy of the other app to reach.
 */
export const PROTOTYPES_URL = 'https://johnroche-kitman.github.io/portfolio/prototypes/'

export const IDP_URL = 'https://johnroche-kitman.github.io/portfolio/idp/'

/** One athlete's development plan, in the other prototype. */
export const idpUrl = athleteId => `${IDP_URL}#/individual_development_plans/${athleteId}`
