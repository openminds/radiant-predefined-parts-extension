namespace :radiant do
  namespace :extensions do
    namespace :predefined_parts do
      
      desc "Runs the migration of the Predefined Parts extension"
      task :migrate => :environment do
        require 'radiant/extension_migrator'
        if ENV["VERSION"]
          PredefinedPartsExtension.migrator.migrate(ENV["VERSION"].to_i)
        else
          PredefinedPartsExtension.migrator.migrate
        end
      end
      
      desc "Copies public assets of the Predefined Parts to the instance public/ directory."
      task :update => :environment do
        is_svn_or_dir = proc {|path| path =~ /\.svn/ || File.directory?(path) }
        puts "Copying assets from PredefinedPartsExtension"
        Dir[PredefinedPartsExtension.root + "/public/**/*"].reject(&is_svn_or_dir).each do |file|
          path = file.sub(PredefinedPartsExtension.root, '')
          directory = File.dirname(path)
          mkdir_p RAILS_ROOT + directory
          cp file, RAILS_ROOT + path
        end
      end  
    end
  end
end
