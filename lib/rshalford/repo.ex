defmodule RSHalford.Repo do
  use Ecto.Repo,
    otp_app: :rshalford,
    adapter: Ecto.Adapters.Postgres
end
