import React from "react";
import "../loading.css";
export default function Loading({ isLoading, isFullPageLoading, isSimpleLoading }) {

  if (isLoading) {
    return (
      <div
        className={isFullPageLoading ? "full-page-loading" : "simple-loading"}
      >
        <div className="lds-default">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      // <div className="cont">
      //   <Circles
      //     height="80"
      //     width="80"
      //     color="#4fa94d"
      //     ariaLabel="circles-loading"
      //     wrapperStyle={{}}
      //     wrapperClass=""
      //     visible={true}
      //   />
      // </div>
    );
  }

}
