"""
Sphinx Read the Docs theme. (Patched for ESP-IDF)

From https://github.com/ryan-roemer/sphinx-bootstrap-theme.
"""

from os import path

import sphinx


__version__ = '0.1'
__version_full__ = __version__


def get_html_theme_path():
    """Return list of HTML theme paths."""
    cur_dir = path.abspath(path.dirname(path.dirname(__file__)))
    return cur_dir

# See http://www.sphinx-doc.org/en/stable/theming.html#distribute-your-theme-as-a-python-package
def setup(app):
    assert sphinx.version_info >= (2, 0, 0)  # Assuming Sphinx 2.0 or newer

    app.add_html_theme('sphinx_idf_theme', path.abspath(path.dirname(__file__)))

    app.add_config_value('project_slug', '', 'html')
    app.add_config_value('versions_url', '', 'html')
    app.add_config_value('project_homepage', '', 'html')
    app.add_config_value('languages', None, 'html')
    app.add_config_value('download_url', '', 'html')


    # we expect IDF to also add these, but older version may not (and the theme supports non-target-aware docs)
    if "idf_target" not in app.config:
        app.add_config_value('idf_target', None, 'env')
    if "idf_targets" not in app.config:
        app.add_config_value('idf_targets', None, 'env')

    app.connect('html-page-context', inject_template_context)

    # Add Sphinx message catalog
    # See http://www.sphinx-doc.org/en/master/extdev/appapi.html#sphinx.application.Sphinx.add_message_catalog
    rtd_locale_path = path.join(path.abspath(path.dirname(__file__)), 'locale')
    app.add_message_catalog('sphinx', rtd_locale_path)

def inject_template_context(app, pagename, templatename, context, doctree):
    # expose some IDF-specific config in the html_context dict for the theme
    for key in [ "project_slug", "versions_url", "project_homepage", "languages", "idf_target", "idf_targets", "project", "pdf_file"]:
        context[key] = app.config[key]

    # Dictonary for converting from idf target slug to a proper title (esp32s2 -> ESP32-S2)
    context["idf_target_title_dict"] = app.config["idf_target_title_dict"]

    if not app.config.languages:
        raise RuntimeError("The 'languages' config item needs to be set to a list of supported languages (even if just a single element list)")
    if not app.config.language:
        raise RuntimeError("The 'language' config item needs to be set to the language in use")
    if bool(app.config.idf_target) != bool(app.config.idf_targets):
        raise RuntimeError("Either both 'idf_target' and 'idf_targets' variables should be set in Sphinx config, or neither should be set in config.")
