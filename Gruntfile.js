module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-string-replace');

  grunt.task.registerTask('cwd-closure-compiler', '', function () {
    process.chdir('closure-compiler');
  });
  grunt.task.registerTask('cwd-parent', '', function () {
    process.chdir('..');
  });

  grunt.initConfig({
    copy: {
      compiler: {
        files: [
          {
            src: ['closure-compiler/README.md', 'closure-compiler/COPYING'],
            dest: 'packages/google-closure-compiler/'
          },
          {
            src: ['closure-compiler/target/closure-compiler-*-SNAPSHOT.jar'],
            dest: 'packages/google-closure-compiler/compiler.jar'
          }
        ]
      }
    },
    shell: {
      mvn_compiler: {
        command: 'mvn clean package'
      }
    },
    'string-replace': {
      options: {
        replacements: [{
          pattern: '"VERSION_NUMBER"',
          replacement: '"' + '20150126.0.0' + '"'
        }]
      },
      compiler: {
        files: {
          'packages/google-closure-compiler/package.json': 'templates/compiler-package.json'
        }
      }
    }
  });

  grunt.registerTask('compiler', ['cwd-closure-compiler', 'shell:mvn_compiler', 'cwd-parent',
      'copy:compiler', 'string-replace:compiler']);
};
