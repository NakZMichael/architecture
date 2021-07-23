import React, {useRef, useState} from 'react';
import Draft, {Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft';
import {makeStyles} from '@material-ui/core';

export type MyEditorProps = Omit<
  React.ComponentPropsWithRef<typeof Editor>,
  'editorState' | 'onChange'
>;

const useStyles = makeStyles(((theme) =>({
  root: {
    fontFamily: '\'Helvetica\', sans-serif',
    padding: 20,
    width: 600,
  },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 80,
    padding: 10,
  },
  button: {
    marginTop: 10,
    textAlign: 'center',
  },
})));

export const MyEditor = (props: MyEditorProps) => {
  const classes = useStyles();

  const domEditor = useRef<Draft.Editor>();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );
  const onChange = (state: EditorState) => setEditorState(state);
  const handleKeyCommand = (
      command: Draft.DraftEditorCommand,
      state: EditorState,
  ) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    console.log(command);
    if (newState) {
      onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  };
  const _onBoldClick = () => {
    onChange(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };
  const setDomEditorRef = (ref:Draft.Editor)=>{
    domEditor.current = ref;
  };
  const logState = () => console.log(editorState.toJS());

  return (
    <div className={classes.root}>
      <button onClick={_onBoldClick}>Bold</button>
      <div className={classes.editor} onClick={domEditor.current?.focus}>
        <Editor
          {...props}
          editorState={editorState}
          onChange={(state) => {
            setEditorState(state);
          }}
          placeholder="Enter some text..."
          handleKeyCommand={handleKeyCommand}
          ref={setDomEditorRef}
        />
      </div>
      <input
        type="button"
        className={classes.button}
        onClick={logState}
        value="Log State"
      />
    </div>
  );
};
