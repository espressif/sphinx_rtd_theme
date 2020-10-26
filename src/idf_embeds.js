/* idf_embeds.js */
var jQuery = (typeof(window) != 'undefined') ? window.jQuery : require('jquery');
const semver = require('semver');

/* Setup the version and target select defined in layout.html template */
function setupVersions() {
    jQuery(function ($) {
        let release = DOCUMENTATION_OPTIONS.RELEASE;
        let language = DOCUMENTATION_OPTIONS.LANGUAGE;
        let idf_target = DOCUMENTATION_OPTIONS.IDF_TARGET;
        let pagename = DOCUMENTATION_OPTIONS.PAGENAME + ".html";
        let versions = DOCUMENTATION_VERSIONS.VERSIONS;
        let defaults = DOCUMENTATION_VERSIONS.DEFAULTS;
        let idf_targets = DOCUMENTATION_VERSIONS.IDF_TARGETS;

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
           <project_base_url>/<language>/<version>/<idf_target>

           (Where 'idf_target' path element are optional depending on if the project has multiple target support)
         */
        let project_base_url = DOCUMENTATION_OPTIONS.URL_ROOT + "../..";
        if (DOCUMENTATION_OPTIONS.HAS_IDF_TARGETS) {
            project_base_url += "/..";
        }

        /* Given a version from the list, return the URL to link to it */
        function getVersionUrl(v, has_target) {
            let result = project_base_url + "/" + language + "/" + v;
            if (has_target) {
                result += "/" + (idf_target || "esp32");
            }

            result += "/" + pagename; // add the relative path of this page

            return result;
        };

        /* Given a target from the list, return the URL to link to it */
        function getTargetUrl(t) {
            let result = project_base_url + "/" + language + "/" + release + "/" + t;
            result += "/" + pagename; // add the relative path of this page

            return result;
        };

        function add_target_selector() {
            var selectList = document.getElementById("target-select");
            selectList.onchange = target_sel;
            for (let i = 0; i < idf_targets.length; i++) {
                let t = idf_targets[i];
                var option = new Option(t.text, t.value);
                selectList.add(option);
            }

            selectList.value = idf_target;
        };

        function add_version_selector() {
            var selectList = document.getElementById("version-select");
            selectList.onchange = version_sel;

            var cur_ver_added = false;

            function add_option(name, text, has_targets) {
                var option = new Option(text, name);
                option.setAttribute('data-has_target', has_targets);
                selectList.add(option);

                if (name == release) {
                    cur_ver_added = true;
                }
            }
            /* Add versions in the order we wish to display
                1. Stable
                2. Release versions
                3. master
                4. pre-releases
            */

            /* Add all the current release versions */
            var stable = getStableVersion();
            for (let i = 0; i < versions.length; i++) {
                let v = versions[i];
                if (!v.old && !v.pre_release && !(v.name == "latest")) {

                    if (v.name == stable.name) {
                        var option_text =  `stable (${stable.name})`;
                    } else {
                        var option_text = versionToBranchName(v.name);
                    }

                    if (supportsTarget(v, idf_target)) {
                        add_option(v.name, option_text, v.has_targets);
                    }
                }
            }

            var option = new Option("Pre-Release Versions", "");
            option.disabled = true;
            selectList.add(option);

            /* Add latest/master */
            for (let i = 0; i < versions.length; i++) {
                let v = versions[i];

                if (v.name == "latest") {
                    add_option(v.name, versionToBranchName(v.name), v.has_targets);
                }
            }

            /* Add pre-releases */
            for (let i = 0; i < versions.length; i++) {
                let v = versions[i];

                if (!v.old && v.pre_release) {

                    if (supportsTarget(v, idf_target)) {
                        add_option(v.name, versionToBranchName(v.name), v.has_targets);
                    }
                }
            }

            if (!cur_ver_added) {
                /* Add current version to the select, this could be an old version or a local branch */
                var option = new Option(versionToBranchName(release), release, true, true);
                selectList.add(option);
            }

            selectList.value = release;

        };

        function version_sel() {
            var version = $("#version-select option:selected");
            window.location.href = getVersionUrl(version.val(), version.data('has_target'));
        };

        function target_sel() {
            var target = $('#target-select').val();
            window.location.href = getTargetUrl(target);
        };

        add_target_selector();
        add_version_selector();

    });
}

/* Converts from version name used by read the docs e.g. "latest" or "release-vX.Y"
   to Git branch names, e.g. "master" and "release/4.2"
 */
function versionToBranchName(version_name) {

    if (version_name == "latest") {
        return "master (latest)";
    } else if (version_name.startsWith("release-")) {
        return version_name.replace("release-", "release/");
    } else {
        return version_name;
    }
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

function supportsTarget(version, target) {
    /* No target means only ESP32 is supported */
    if (typeof version.supported_targets == 'undefined') {
        return (version.name == "esp32");
    }
    return version.supported_targets.includes(target);
}


if (typeof(window) != 'undefined') {
    setupVersions();
}
