defmodule AudioengineWeb.SessionView do
  use AudioengineWeb, :view

  def render("show.json", %{ state: state }) do
    state
  end
end
