********************
ESP-IDF Sphinx Theme
********************

**This is a fork of sphinx-rtd-theme by Read The Docs. This fork is used by the ESP-IDF Programming Guide. Espressif forked this theme when we moved ESP-IDF Programming Guide away from Read The Docs' hosted service and needed some functionality that neither RTD nor the theme provide out of the box.**

Notes for ESP-IDF Theme
=======================

Development Builds
^^^^^^^^^^^^^^^^^^

This theme must be imported as a Python package **not using Sphinx's html_theme_path option**, as it relies on some code in ``__init__.py``. To debug the theme in development, ``setup.py develop`` doesn't seem to work out of the box (can probably be made to work easily, please update this file if you know the steps). The following hacky approach definitely works:

- Run ``python3 setup.py build`` in this directory.
- In top of IDF docs ``conf_common.py``, add a temporary ``sys.path.append('/path/to/here/build/lib')``.
- Remove ``sphinx_idf_theme==0.X`` from ``doc/requirement.txt``
- Run IDF docs build, it will import the just-built theme from this directory as a package.
- (When changing theme, re-run ``setup.py build``).

New Features
^^^^^^^^^^^^

- Can support a new URL component under the RTD ``project/language/version`` URL standard, so projects can be ``project/language/version/target`` if the project has multiple targets which each have a totally different docs build.
- Loads the version information in the versions popup using JavaScript on the client (see "Versions file" below). No dynamic webserver support is needed but the popup can be updated without needing to rebuild all versions of the docs.

Technical Changes
^^^^^^^^^^^^^^^^^

- New JavaScript file ``idf_embeds.js`` is compiled into ``theme.js``, sets up version footer.
- Templates for layout & versions.html have been modified.

To Use In a Sphinx Project
^^^^^^^^^^^^^^^^^^^^^^^^^^

Set the following additional config variables in the Sphinx project:

- ``idf_target`` - slug of the IDF target (ie esp32, esp32s2). Optional, but either both this option and ``idf_targets`` must be set or neither must be set.
- ``idf_targets`` - Python list with short names of all supported IDF targets (ie ``["esp32", "esp32s2"]``).
- ``idf_target_title_dict`` - Python dictonary which maps from short names of all supported IDF targets (ie ``["esp32", "esp32s2"]``) to full names (ie ``["ESP32", "ESP32-S2"]``).
- ``languages`` - Python list with short names of all supported languages (ie ``["en", "zh_CN"]``). Must be set to at least one language element (the current project's language)
- ``project_slug`` - short name of the project as a URL slug (ie ``esp-idf``)
- ``versions_url`` - URL to download the ``versions.js`` file from
- ``project_homepage`` - URL of the project's main page (GitHub, etc)
- ``pdf_file`` - URL to the page where the PDF of HTML is stored, relative to the root dir, used for generating the link to download the PDF

- ``version`` - Standard Sphinx variable, holds the comprehensive version number of the project.
- ``release`` - This should be the "human readable" version of the ``version``. ``release`` is used in URL slugs, and is used to pattern match inside the Versions file. Currently in ESP-IDF docs, ``release`` is generated using similar sanitization rules to RTD (summary: uses the tag name if available, or branch name if available, or falls back to ``version`` otherwise. ``master`` becomes ``latest``, any branch name with a ``/`` in it becomes a ``-``.)

Versions file
^^^^^^^^^^^^^

The file found at the ``versions_url`` location should be a JavaScript file describing all current versions. It is loaded by JavaScript in the theme and used to build the version switching popup in the bottom left.

The file should take this form:

.. code-block:: javascript

    var DOCUMENTATION_VERSIONS = {
            "DEFAULTS": { "has_targets": false },
            "VERSIONS": [
                { "name": "latest", "has_targets": true },
                { "name": "v4.0" },
                { "name": "v3.3.1" },
                { "name": "v3.3", "old": true  },
                { "name": "v3.2.3" },
                { "name": "v3.2.2", "old": true },
                { "name": "v3.1.6" },
                { "name": "v3.1.5", "old": true },
                { "name": "v3.0.9", "old": true },
                { "name": "v4.0-rc", "pre_release": true },
                { "name": "v4.0-beta2", "pre_release": true },
                { "name": "release-v4.1", "pre_release": true },
                { "name": "release-v4.0", "pre_release": true },
                { "name": "release-v3.3", "pre_release": true },
                { "name": "release-v3.2", "pre_release": true },
                { "name": "release-v3.1", "pre_release": true },
            ]
        };

.. note::
   This file is JavaScript so it can be easily included in a script tag, but in the future it may be parsed elsewhere. Therefore is should contain a single assignment statement which assigns the ``DOCUMENTATION_VERSIONS`` variable to a valid JSON object. Including any other JavaScript computation in this file is invalid.

Inside the ``DOCUMENTATION_VERSIONS`` object:

- ``VERSIONS`` key is a list of versions
- Each version is a JSON object with at minimum a ``name`` key which is the version name "slug" (corresponds to ``release`` config variable).
- Optionally, one or more of the following keys:
  - ``has_targets`` is true if the URLs for these docs have a target element, ie ``<project>/<language>/<version>/<target>``. false if the URL format is ``<project>/<language>/<version>``. A single project can have some versions which include and some which exclude the target URL component, and the theme will try to generate version links that add or drop the ``<target>`` element as applicable.
  - ``old`` is true if this version is not current, will be shown in "Old Versions" section under the main versions.
  - ``pre_release`` is true if this version is a prerelease not a stable release, will be shown in "Prereleases" section under the main versions
- ``DEFAULTS`` key contains the default values for any keys which are not supplied in an individual version object. This exists as "sugar" to make the file more readable.


Original RTD Theme README
=========================

.. image:: https://img.shields.io/pypi/v/sphinx_rtd_theme.svg
   :target: https://pypi.python.org/pypi/sphinx_rtd_theme
   :alt: Pypi Version
.. image:: https://travis-ci.org/readthedocs/sphinx_rtd_theme.svg?branch=master
   :target: https://travis-ci.org/readthedocs/sphinx_rtd_theme
   :alt: Build Status
.. image:: https://img.shields.io/pypi/l/sphinx_rtd_theme.svg
   :target: https://pypi.python.org/pypi/sphinx_rtd_theme/
   :alt: License
.. image:: https://readthedocs.org/projects/sphinx-rtd-theme/badge/?version=latest
  :target: http://sphinx-rtd-theme.readthedocs.io/en/latest/?badge=latest
  :alt: Documentation Status

This Sphinx_ theme was designed to provide a great reader experience for
documentation users on both desktop and mobile devices. This theme is used
primarily on `Read the Docs`_ but can work with any Sphinx project. You can find
a working demo of the theme in the `theme documentation`_

.. _Sphinx: http://www.sphinx-doc.org
.. _Read the Docs: http://www.readthedocs.org
.. _theme documentation: https://sphinx-rtd-theme.readthedocs.io/en/latest/

Installation
============

This theme is distributed on PyPI_ and can be installed with ``pip``:

.. code:: console

   $ pip install sphinx-rtd-theme

To use the theme in your Sphinx project, you will need to add the following to
your ``conf.py`` file:

.. code:: python

    import sphinx_idf_theme

    extensions = [
        ...
        "sphinx_idf_theme",
    ]

    html_theme = "sphinx_idf_theme"

For more information read the full documentation on `installing the theme`_

.. _PyPI: https://pypi.python.org/pypi/sphinx_idf_theme
.. _installing the theme: https://sphinx-rtd-theme.readthedocs.io/en/latest/installing.html

Configuration
=============

This theme is highly customizable on both the page level and on a global level.
To see all the possible configuration options, read the documentation on
`configuring the theme`_.

.. _configuring the theme: https://sphinx-rtd-theme.readthedocs.io/en/latest/configuring.html

Contributing
============

If you would like to help modify or translate the theme, you'll find more
information on contributing in our `contributing guide`_.

.. _contributing guide: https://sphinx-rtd-theme.readthedocs.io/en/latest/contributing.html
