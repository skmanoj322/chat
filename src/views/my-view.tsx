import React, { Component } from "react";

export interface Props {
  title: string;
  lang: string;
}

// Important -- use the `default` export
export default class MyView extends Component<Props> {
  render() {
    return (
      <button
        onClick={() => {
          console.log("hello there");
        }}
      >
        Hello from React! Title: {this.props.title}
      </button>
    );
  }
}
