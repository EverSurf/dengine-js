
Pod::Spec.new do |s|
  s.name         = "DebotClientModule"
  s.version      = "0.9.0"
  s.summary      = "Dengine for React Native"
  s.description  = <<-DESC
                  Dengine React Native Module
                   DESC
  s.homepage     = "https://github.com/EverSurf/dengine-js"
  s.license      = "MIT"
  s.author       = { "author" => "support@ever.surf" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/EverSurf/dengine-js.git", :tag => "master" }
  s.source_files = "ios/**/*.{h,m,mm}"
  s.ios.vendored_library = "ios/libdengine.a"

  s.requires_arc = true
  s.dependency "React"
end


