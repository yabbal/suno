class Suno < Formula
  desc "CLI for Suno — AI music generation"
  homepage "https://github.com/yabbal/suno"
  url "https://registry.npmjs.org/@yabbal/suno-cli/-/suno-cli-0.1.0.tgz"
  sha256 "PLACEHOLDER"
  license "MIT"

  depends_on "node@24"

  def install
    system "npm", "install", *std_npm_args
    bin.install_symlink libexec/"bin/suno"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/suno version")
  end
end
