import { jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from "react";
// Important -- use the `default` export
export default class MyView extends Component {
    render() {
        return (_jsxs("button", { onClick: () => {
                console.log("hello there");
            }, children: ["Hello from React! Title: ", this.props.title] }));
    }
}
