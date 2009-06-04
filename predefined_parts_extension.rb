class PredefinedPartsExtension < Radiant::Extension
  version "1.0"
  description "Have a list of predefined parts to select from"
  url "http://github.com/defv/radiant-predefined-parts-extension"
  
  def activate
    Radiant::Config['predefined_parts.parts'] ||= 'body, content-sec, video' if Radiant::Config.table_exists?
    
    admin.page.edit.add :main, 'predefined_parts_includes', :before => 'edit_header'
    admin.page.edit.add :popups, 'part_popup'
  end
  
  def deactivate
  end
end
