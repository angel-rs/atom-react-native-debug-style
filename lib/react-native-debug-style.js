'use babel';

import ReactNativeDebugStyleView from './react-native-debug-style-view';
import { CompositeDisposable } from 'atom';

export default {
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'react-native-debug-style:toggle': () => this.toggle()
    }));
  },

  toggle() {
    const editor = atom.workspace.getActiveTextEditor()
    const codeToInstert = `const StyleSheet = require('react-native-debug-stylesheet');`
    const toggleOffRegexp = `\/\/ import.*StyleSheet.*react\-native.*\nconst StyleSheet.*`
    const toggleOnRegexp = `import.*StyleSheet.*react\-native.*`
    const regexpFlags = 'g'

    if (editor) {
      let foundAMatch = false

      editor.scan(new RegExp(toggleOffRegexp, regexpFlags), (iterator) => {
        foundAMatch = true

        const retrieveOldStateRegexp = /import.*StyleSheet.*react\-native.*/g
        const m = retrieveOldStateRegexp.exec(iterator.matchText)
        iterator.replace(m[0])
        iterator.stop()
      })

      if (!foundAMatch) {
        editor.scan(new RegExp(toggleOnRegexp, regexpFlags), (iterator) => {
          foundAMatch = true

          iterator.replace(`// ${iterator.match}\n${codeToInstert}`)
          iterator.stop()
        })
      }

      if (!foundAMatch) {
        console.log('There was no match!')
      }
    }


  }

};
