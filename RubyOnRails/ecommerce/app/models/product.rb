class Product < ApplicationRecord
  belongs_to :category

  validates :name, presence: true
  validates :name, :uniqueness => { :scope => [:is_deleted], :case_sensitive => false }
  default_scope -> { where(is_deleted: false) }
  default_scope -> { order(name: :asc) }

  include SearchCop
  search_scope :search do
    attributes :name, :product_code, :price
    attributes category: ["category.name"]
  end

  def self.show_product_fields
    return {
             :include => [
               :category => { :only => ["name", "id"] },
             ],
             :only => ["name", "id", "price", "product_code"],
           }
  end
end
