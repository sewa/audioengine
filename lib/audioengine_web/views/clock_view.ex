defmodule AudioengineWeb.ClockView do
  use AudioengineWeb, :view

  def render("index.json", %{ state: state }) do
    state
  end
end
