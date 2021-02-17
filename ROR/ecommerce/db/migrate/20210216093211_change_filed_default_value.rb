class ChangeFiledDefaultValue < ActiveRecord::Migration[5.2]
  def change
    change_column :products, :is_deleted, :boolean, default: true
    change_column :customers, :is_deleted, :boolean, default: true
  end
end
