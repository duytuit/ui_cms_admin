import "jodit";
import "jodit/build/jodit.min.css";
import JoditEditor from "jodit-react";
import { DeepPartial } from "@reduxjs/toolkit";
import "../../styles/demo/code.scss"
const buttons = [
    "undo",
    "redo",
    "|",
    "bold",
    "strikethrough",
    "underline",
    "italic",
    "|",
    "superscript",
    "subscript",
    "|",
    "align",
    "|",
    "ul",
    "ol",
    "outdent",
    "indent",
    "|",
    "font",
    "fontsize",
    "brush",
    "paragraph",
    "lineHeight",
    "|",
    "image",
    "link",
    "table",
    "|",
    "hr",
    "eraser",
    "copyformat",
    "|",
    "fullsize",
    "selectall",
    "print",
    "|",
    "source",
    "|"
];

const editorConfig:DeepPartial<any> = {
    readonly: false,
    toolbar: true,
    spellcheck: true,
    language: "en",
    toolbarButtonSize: "medium",
    toolbarAdaptive: false,
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    askBeforePasteHTML: true,
    askBeforePasteFromWord: true,
    //defaultActionOnPaste: "insert_clear_html",
    buttons: buttons,
    // width: 800,
    height: 842,
    uploader: {
        url: '/api/system/upload/create',  //your upload api url
        insertImageAsBase64URI: false,
        imagesExtensions: ['jpg', 'png', 'jpeg', 'gif'],
        //headers: {"token":`${db.token}`},
        filesVariableName: function (t:any) {
          return 'files';
        }, //"files",
        withCredentials: false,
        pathVariableName: 'path',
        format: 'json',
        method: 'POST',
        prepareData: function (formdata:any) {
          return formdata;
        },
        isSuccess: function (data:any) {
          if (data.data && data.data.length) {
            const tagName = 'img';
            data.data.forEach((item: any, index: number) => { //edetor insertimg function
              const elm = this.jodit.createInside.element(tagName);
              const externalLink = item.externalLink.replace("public", "")
              elm.setAttribute('src',process.env.REACT_APP_UPLOAD_CDN+externalLink);
              this.jodit.s.insertImage(elm as HTMLImageElement, null, this.o.imageDefaultWidth);
            });
          }
        },
        getMessage: function (e:any) {
          return void 0 !== e.data.messages && Array.isArray(e.data.messages)
            ? e.data.messages.join('')
            : '';
        },
        process: function (resp: any) { //success callback transfrom data to defaultHandlerSuccess use.it's up to you.
            console.log('sdfdsfsfd',resp);
            
            let files = [];
          files.unshift(resp.data);
          return {
            files: resp.data,
            error: resp.msg,
            msg: resp.msg,
          };
        },
        error: function (this: any, e: Error) { 
          this.j.e.fire('errorMessage', e.message, 'error', 4000);
        },
        defaultHandlerSuccess: function (this: any, resp: any) { // `this` is the editor.
          const j = this;
          console.log(resp);
          
          if (resp.files && resp.files.length) {
            const tagName = 'img';
            resp.files.forEach((externalLink: string, index: number) => { //edetor insertimg function
              const elm = j.createInside.element(tagName);
              elm.setAttribute('src', externalLink);
              j.s.insertImage(elm as HTMLImageElement, null, j.o.imageDefaultWidth);
            });
          }
        },
        defaultHandlerError: function (this: any, e:any) {
          this.j.e.fire('errorMessage', e.message);
        },
        contentType: function (e:any) {
          return (
            (void 0 === this.jodit.ownerWindow.FormData || 'string' == typeof e) &&
            'application/x-www-form-urlencoded; charset=UTF-8'
          );
        },
      },
};

function Editor(props:any) {
    const { data, setData } = props;
    return (
        <>
         <div className="App" style={{ margin: "0 auto" }}>
            <JoditEditor
                value={data ? data : ''}
                config={editorConfig}
                // onChange={value => setData ? setData(value) : () => {}}
            />
        </div>
        </>
    );
}

export default Editor;
