class Post < ApplicationRecord
  scope :visible, -> { where(draft: false) }
  has_rich_text :body
end
