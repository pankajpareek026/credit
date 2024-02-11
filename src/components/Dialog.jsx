import React, { useRef, useState, useEffect } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
export default function Dialog({ onClose, link, message, isOpened, on }) {
  const linkRef = useRef(null);
  const dialogRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const copyLinkOnClipBoard = () => {
    window.navigator.clipboard.writeText(link);
    linkRef.current?.select();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (isOpened) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpened]);

  const closeDialog = () => {
    onClose();
  };
  return (
    <dialog ref={dialogRef}>
      <p className="title">Link Generated successfully !</p>
      <hr />
      <hr />
     
      <p className="text">{message}</p>
      <div className="link-container">
        <input ref={linkRef} className="link" value={link} readOnly />

        {/* <ContentCopyIcon className="copy-icon" /> */}
        <button onClick={copyLinkOnClipBoard} className="copy-btn">
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <button className="close-icon" onClick={closeDialog}>
        close
      </button>
    </dialog>
  );
}
