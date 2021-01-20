import {ServerStyleSheets, ThemeProvider} from "@material-ui/styles";
import ReactDOMServer from "react-dom/server";
import {StaticRouter} from "react-router-dom";
import theme from "./ui/theme";
import MainRouter from "./ui/MainRouter";
import Template from "./ui/template";
import React from "react";

export default function ServerSideMainPage(req, res) {
    const sheets = new ServerStyleSheets()
    const context = {}
    const markup = ReactDOMServer.renderToString(
        sheets.collect(
            <StaticRouter location={req.url} context={context}>
                <ThemeProvider theme={theme}>
                    <MainRouter/>
                </ThemeProvider>
            </StaticRouter>
        )
    )

    if (context.url) {
        return res.redirect(303, context.url)
    }

    const css = sheets.toString()
    res.status(200).send(Template({
        markup: markup,
        css: css
    }))
}