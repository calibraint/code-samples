class Category < ApplicationRecord
  belongs_to :product

  validates :name, presence: true
  validates :name, :uniqueness => { :scope => [:is_deleted], :case_sensitive => false }
  default_scope -> { where(is_deleted: false) }
  default_scope -> { order(name: :asc) }

  include SearchCop
  search_scope :search do
    attributes :name
  end
end
