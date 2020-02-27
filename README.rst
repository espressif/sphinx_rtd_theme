********************
ESP-IDF Sphinx Theme
********************

**This is a fork of sphinx-rtd-theme by Read The Docs. This fork is used by the ESP-IDF Programming Guide. Espressif forked this theme when we moved ESP-IDF Programming Guide away from Read The Docs' hosted service and needed some functionality that neither RTD nor the theme could provide out of the box.**

Notes for ESP-IDF Theme
=======================

Development Builds
^^^^^^^^^^^^^^^^^^

This theme must be imported as a Python package **not using html_theme_path**, as it relies on some code in ``__init__.py``. To debug the theme in development, best approach I've found is:

- Run ``python3 setup.py build`` in this directory.
- In top of IDF docs ``conf_common.py``, add a temporary ``sys.path.append('/path/to/here/build/lib')``.
- Run IDF docs build, it will import the just-built theme from this directory as a package.

Changes
^^^^^^^

- New JavaScript file ``idf_embeds.js`` is compiled into ``theme.js``, sets up version footer.

To Use In a Sphinx Project
^^^^^^^^^^^^^^^^^^^^^^^^^^

Set the following additional config variables in the Sphinx project:

- `idf_target` - slug of the IDF target (ie esp32, esp32s2).
- `idf_targets` - comma-delimited names of all supported IDF targets (ie esp32,esp32s2)
- `project` - name of the project (normal Sphinx property)
- `project_slug` - short name of the project as a URL slug (ie `esp-idf`)
- `versions_url` - URL to download the `versions.js` file from

Versions file
^^^^^^^^^^^^^

TBD



Original RTD Theme Docs Follow
==============================

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
