/* idf_embeds.js */
var jQuery = (typeof(window) != 'undefined') ? window.jQuery : require('jquery');
const semver = require('semver');

/* Setup the popup defined in versions.html template */
function setupVersions() {
    jQuery(function ($) {
        let version = DOCUMENTATION_OPTIONS.VERSION;
        let language = DOCUMENTATION_OPTIONS.LANGUAGE;
        let idf_target = DOCUMENTATION_OPTIONS.IDF_TARGET;
        let pagename = DOCUMENTATION_OPTIONS.PAGENAME + ".html";

        let defaults = DOCUMENTATION_VERSIONS.DEFAULTS;
        let versions = DOCUMENTATION_VERSIONS.VERSIONS;

        /* Apply the defaults to each version, where needed */
        for (let i = 0; i < versions.length; i++) {
            let v = versions[i];
            for (let d in defaults) {
                if (!(d in v)) {
                    v[d] = defaults[d];
                }
            }
        }

        /* Find the (relative) base URL for this project, finding a sibling URL will be built as follows:
           <project_base_url>/<language>/<idf_target>/<version>

           (Where language and target path elements are optional depending on if the project/version has these.)
         */
        let project_base_url = DOCUMENTATION_OPTIONS.URL_ROOT + "..";
        if (DOCUMENTATION_OPTIONS.LANGUAGES) {
            project_base_url += "/..";
        }
        if (DOCUMENTATION_OPTIONS.IDF_TARGETS) {
            project_base_url += "/..";
        }
        console.log("project_base_url = " + project_base_url);

        /* Given a version from the list, return the URL to link to it */
        function getVersionUrl(v) {
            let result = project_base_url;
            if (v.has_languages) {
                result += "/" + (language || "en");
            }
            if (v.has_targets) {
                result += "/" + (idf_target || "esp32");
            }
            result += "/" + v.name;

            result += "/" + pagename; // add the relative path of this page

            return result;
        };

        let stable = getStableVersion();
        if (stable.name == version) {
            /* Highlight the stable version if that's what we're looking at */
            $( "#version-stable>a" ).wrap("<strong></strong>");
        } else {
            /* Rewrite the URL for stable to account for languages/targets in that version */
            stable = jQuery.extend({}, stable); // clone the version object to make the name 'stable'
            stable.name = "stable";
            $( "#version-stable>a" ).attr("href", getVersionUrl(stable));
        }

        /* Add all the other versions to the versions list
           3 possible sections - each with a different ID on the dl tag
         */
        let new_html = {
            "versions" : "",
            "versions-prerelease" : "",
            "versions-old" : "",
        };
        for (let i = 0; i < versions.length; i++) {
            let v = versions[i];
            let url = getVersionUrl(v);

            if (v.name == "latest") {
                // Rewrite the URL for existing latest link
                $( "#version-latest>a" ).attr("href", url);
            } else {
                let new_entry = "<dd><a href=\"" + url + "\">" + v.name + "</dd>";
                if (isPrerelease(v)) {
                    new_html["versions-prerelease"] += new_entry;
                } else if (v.old) {
                    new_html["versions-old"] += new_entry;
                } else {
                    new_html["versions"] += new_entry;
                }
            }
        }

        for (key in new_html) {
            if (new_html[key]) {
                $( "#"+key ).append(new_html[key]);
                $( "#"+key+">dt").removeAttr("hidden");
            }
        }

    });
}

/* Return true if this version object is a prerelease

   Note: semver module has a semver.prerelease(x) function but it doesn't work
   correctly for prerelease versions which don't have a bugfix version - ie
   v4.0.1-beta2 is considered a prerelease but v4.0-beta3 is parsed as v4.0
   (with semver.coerce or semver.prerelease).

   So instead we define a simple regex for vX.Y.Z type version numbers, and
   assume anything which doesn't match this is a prerelease.
 */
function isPrerelease(v) {
    const release_re = /^v[0-9\.]+$/
    return (v.name == "stable") || !release_re.test(v.name);
}

/* Return the highest numbered version which is not a prerelease */
function getStableVersion() {
    let versions = DOCUMENTATION_VERSIONS.VERSIONS;
    let candidate = null;
    for (let i = 0; i < versions.length; i++) {
        let v = versions[i];
        /* Note: not using semver.prerelease() to detect prereleases as semver can't parse/coerce prerelease
           from a version with no bugfix number, ie can do v4.0.1-beta2 but drops the prerelease from v4.0-beta2. */
        if (v.name.startsWith("v") && !isPrerelease(v)
            && (!candidate || (semver.coerce(v.name) > semver.coerce(candidate.name)))) {
            candidate = v;
        }
    }
    return candidate;
}


if (typeof(window) != 'undefined') {
    setupVersions();
}

