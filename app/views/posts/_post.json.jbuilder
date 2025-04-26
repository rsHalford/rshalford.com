json.extract! post, :id, :title, :body, :draft, :tags, :created_at, :updated_at
json.url post_url(post, format: :json)
