# -*- coding: utf-8 -*-
"""`sphinx_rtd_theme` lives on `Github`_.

(This is a fork of sphinx_rtd_theme)

.. _github: https://github.com/rtfd/sphinx_rtf_theme

"""

import os
import subprocess
import distutils.cmd
import setuptools.command.build_py
from io import open
from setuptools import setup
import os.path


class WebpackBuildCommand(setuptools.command.build_py.build_py):

    """Prefix Python build with Webpack asset build"""

    def run(self):
        subprocess.run(['npm', 'install'], check=True)
        subprocess.run(['node_modules/.bin/webpack', '--config', 'webpack.prod.js'], check=True)
        setuptools.command.build_py.build_py.run(self)


class WebpackDevelopCommand(distutils.cmd.Command):

    description = "Run Webpack dev server"

    user_options = []

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        subprocess.run(
            ["node_modules/.bin/webpack-dev-server", "--open", "--config", "webpack.dev.js"],
            check=True
        )


class UpdateTranslationsCommand(distutils.cmd.Command):

    description = "Run all localization commands"

    user_options = []
    sub_commands = [
        ('extract_messages', None),
        ('update_catalog', None),
        ('transifex', None),
        ('compile_catalog', None),
    ]

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        for cmd_name in self.get_sub_commands():
            self.run_command(cmd_name)


class TransifexCommand(distutils.cmd.Command):

    description = "Update translation files through Transifex"

    user_options = []

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        subprocess.run(['tx', 'push', '--source'], check=True)
        subprocess.run(['tx', 'pull'], check=True)

FILE_PATH = os.path.abspath(os.path.dirname(__file__))

setup(
    name='sphinx_idf_theme',
    version='0.4.1',
    url='https://github.com/espressif/sphinx_idf_theme/',
    license='MIT',
    author='Dave Snider, Read the Docs, Inc. & contributors, modified by Espressif Systems (Shanghai) Co Ltd',
    author_email='',
    description='IDF theme for Sphinx, based on Read The Docs theme',
    long_description=open(os.path.join(FILE_PATH, 'README.rst'), encoding='utf-8').read(),
    cmdclass={
        'update_translations': UpdateTranslationsCommand,
        'transifex': TransifexCommand,
        'build_py': WebpackBuildCommand,
        'watch': WebpackDevelopCommand,
    },
    zip_safe=False,
    packages=['sphinx_idf_theme'],
    package_data={'sphinx_idf_theme': [
        'theme.conf',
        '*.html',
        'static/css/*.css',
        'static/css/fonts/*.*'
        'static/js/*.js',
    ]},
    include_package_data=True,
    # See http://www.sphinx-doc.org/en/stable/theming.html#distribute-your-theme-as-a-python-package
    entry_points = {
        'sphinx.html_themes': [
            'sphinx_idf_theme = sphinx_idf_theme',
        ]
    },
    install_requires=[
       'sphinx'
    ],
    tests_require=[
        'pytest',
    ],
    extras_require={
        'dev': [
            'transifex-client',
            'sphinxcontrib-httpdomain',
        ],
    },
    classifiers=[
        'Framework :: Sphinx',
        'Framework :: Sphinx :: Theme',
        'Development Status :: 5 - Production/Stable',
        'License :: OSI Approved :: MIT License',
        'Environment :: Console',
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Operating System :: OS Independent',
        'Topic :: Documentation',
        'Topic :: Software Development :: Documentation',
    ],
)
