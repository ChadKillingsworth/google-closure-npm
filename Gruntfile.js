module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-usage');

  var version = grunt.option('ver');

  grunt.task.registerTask('ensure-version-specified', '', function() {
    if (!version) {
      grunt.fail.fatal('You must specify the version to build with the --ver option.', 3);
    }

    var parsedVersion = parseInt(version, 10);
    if ('' + parsedVersion != version) {
      grunt.fail.fatal('The version should be an integer.', 3);
    }
  });

  grunt.task.registerMultiTask('write-package-json', '', function () {
    var version = this.options().version;
    this.files.forEach(function(file) {
      var contents = JSON.parse(grunt.file.read(file.src));
      contents.version = version;
      grunt.file.write(file.dest, JSON.stringify(contents, null, 2) + '\n');
    })
  });

  grunt.initConfig({
    usage: {
      options: {
        title: 'Build and package closure tools (compiler and templates) for publication via NPM',
        hideTasks: true,
        taskGroups: [
          {
            header: 'Build tasks',
            tasks: ['compiler', 'templates']
          }
        ],
        taskDescriptionOverrides: {
          compiler: 'Uses maven to build the compiler from source and copy ' +
              'distributable files to the package.',
          templates: 'Uses maven to build templates from source and copy ' +
              'distributable files to the package. Since closure-templates does ' +
              'not have tagged releases, make sure the closure-templates submodule ' +
              'HEAD points to the desired commit.'
        },
        description: 'hello world'
      }
    },
    clean: {
      compiler: ['packages/google-closure-compiler'],
      library: ['packages/google-closure-library'],
      templates: ['packages/google-closure-templates']
    },
    copy: {
      compiler: {
        files: [
          {
            expand: true,
            cwd: 'closure-compiler/',
            src: ['README.md', 'COPYING'],
            dest: 'packages/google-closure-compiler/'
          },
          {
            expand: true,
            cwd: 'closure-compiler/target',
            src: 'closure-compiler-*-SNAPSHOT.jar',
            dest: 'packages/google-closure-compiler',
            rename: function(orig) {
              return orig + '/compiler.jar';
            }
          }
        ]
      },
      templates: {
        files: [
          {
            expand: true,
            cwd: 'closure-templates/',
            src: ['README.md', 'CONTRIBUTING.md', 'COPYING'],
            dest: 'packages/google-closure-templates/'
          },
          {
            expand: true,
            cwd: 'closure-templates/target',
            src: 'soy-*-SNAPSHOT-with-dependencies.jar',
            dest: 'packages/google-closure-templates/java/',
            rename: function(orig) {
              return orig + '/Soy.jar';
            }
          },
          {
            expand: true,
            cwd: 'closure-templates/target',
            src: 'soy-*-SNAPSHOT-SoyParseInfoGenerator.jar',
            dest: 'packages/google-closure-templates/java',
            rename: function(orig) {
              return orig + '/SoyParseInfoGenerator.jar';
            }
          },
          {
            expand: true,
            cwd: 'closure-templates/target',
            src: 'soy-*-SNAPSHOT-SoyToJsSrcCompiler.jar',
            dest: 'packages/google-closure-templates/javascript',
            rename: function(orig) {
              return orig + '/SoyToJsSrcCompiler.jar';
            }
          },
          {
            expand: true,
            cwd: 'closure-templates/target',
            src: 'soy-*-SNAPSHOT-SoyMsgExtractor.jar',
            dest: 'packages/google-closure-templates/translation',
            rename: function(orig) {
              return orig + '/SoyMsgExtractor.jar';
            }
          },
          {
            cwd: 'closure-templates/',
            expand: true,
            src: ['python/**'],
            dest: 'packages/google-closure-templates/'
          }
        ]
      }
    },
    shell: {
      'maven-compiler': {
        command: 'mvn clean package',
        options: {
          execOptions: {
            cwd: 'closure-compiler'
          }
        }
      },
      'maven-templates': {
        command: 'mvn clean package',
        options: {
          execOptions: {
            cwd: 'closure-templates'
          }
        }
      },
      'git-checkout-compiler-tag': {
        command: 'git checkout tags/v' + version,
        options: {
          execOptions: {
            cwd: 'closure-compiler'
          }
        }
      },
      'git-checkout-templates-tag': {
        command: 'git checkout tags/v' + version,
        options: {
          execOptions: {
            cwd: 'closure-templates'
          }
        }
      },
      'git-submodule-tags': {
        command: 'git submodule foreach git fetch --tags'
      }
    },
    'write-package-json': {
      templates: {
        files: {
          'packages/google-closure-templates/package.json': ['templates/templates-package.json']
        },
        options: {
          version: version + '.0.0'
        }
      },
      compiler: {
        files: {
          'packages/google-closure-compiler/package.json': ['templates/compiler-package.json']
        },
        options: {
          version: version + '.0.0'
        }
      }
    }
  });

  grunt.registerTask('default', ['usage']);

  grunt.registerTask('compiler', ['ensure-version-specified', 'clean:compiler', 'shell:git-submodule-tags', 'shell:maven-compiler',
      'copy:compiler', 'write-package-json:compiler']);

  grunt.registerTask('templates', ['ensure-version-specified', 'clean:templates', 'shell:maven-templates',
      'copy:templates', 'write-package-json:templates']);
};
