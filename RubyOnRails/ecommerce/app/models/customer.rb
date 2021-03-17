class Customer < ApplicationRecord
  validates :name,:email,:contact_no, presence: true
  validates :email, :uniqueness => { :scope => [:is_deleted], :case_sensitive => false }
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  default_scope -> { where(is_deleted: false) }
  default_scope -> { order(name: :asc) }

  include SearchCop
  search_scope :search do
    attributes :name, :email,:contact_no
  end
end
