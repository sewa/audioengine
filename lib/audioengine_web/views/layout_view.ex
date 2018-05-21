defmodule AudioengineWeb.LayoutView do
  use AudioengineWeb, :view

  def js_script_tag do
    if Mix.env == :prod do
      # In production we'll just reference the file
      "<script src=\"/js/app.js\"></script>"
    else
      # In development mode we'll load it from our webpack dev server
      "<script src=\"http://localhost:8080/js/app.js\"></script>"
    end
  end

  # Ditto for the css
  def css_link_tag do
    if Mix.env == :prod do
      "<link rel=\"stylesheet\" type=\"text/css\" href=\"/css/app.css\" />"
    else
      "<link rel=\"stylesheet\" type=\"text/css\" href=\"http://localhost:8080/css/app.css\" />"
    end
  end
end
