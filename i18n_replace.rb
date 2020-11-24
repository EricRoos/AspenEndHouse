require 'nokogiri'

def is_block_node(node)
  list = %w(
    div
    p
    ol
    ul
    pre
    address
    blockquote
    dl
    div
    fieldset
    form
    hr
    noscript
    table
  )

  list.include?(node.name)
end
def find_parent_section(node, path = [])
  return nil if node.html?
  if node.name == 'section'
    path.prepend(node.attr('id')) if node.attr('id')
    return node
  end
  path << node.attr('id') if node.parent && is_block_node(node) && node.attr('id')
  return find_parent_section(node.parent, path) if node.parent
  return nil
end


puts Nokogiri::HTML(File.read(ARGV[0])).xpath('//text()').reject { |r| r.text.strip.size == 0 }
  .map {|m|
    path = []
    section = find_parent_section(m, path)
    {path: path.join("."), text: m.text.strip}
}.group_by{ |h| h[:path] }.values.map{ |texts|
      count = 0
      texts.map{ |data|
        count += 1
        data.merge({ path: "#{data[:path]}.#{count}"})
      }
    }.flatten
