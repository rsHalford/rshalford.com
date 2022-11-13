{
  description = "rshalford.com";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
      with pkgs;
      {
        devShells.default = mkShell {
          buildInputs = [
            nodejs
            nodePackages.pnpm
            # git-chglog
            # pre-commit
          ];
          shellHook = ''
            echo "node `${nodejs}/bin/node --version`"
          '';
        };
      }
    );
}
