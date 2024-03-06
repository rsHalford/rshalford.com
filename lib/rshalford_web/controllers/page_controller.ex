defmodule RSHalfordWeb.PageController do
  use RSHalfordWeb, :controller

  def index(conn, _params) do
    render(conn, :index, layout: false)
  end

  def post(conn, _params) do
    markdown = File.read!("../../../posts/test.md")
    options = %Earmark.Options{compact_output: false}

    html_doc = Earmark.as_html!(markdown, options)

    render(conn, :post, content: html_doc)
  end
end
