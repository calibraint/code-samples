class AddDefaultValueToIsDeletedAttribute < ActiveRecord::Migration[5.2]
  def change
    change_column :categories, :is_deleted, :boolean, default: true
  end
end
