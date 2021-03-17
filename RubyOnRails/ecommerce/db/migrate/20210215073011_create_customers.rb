class CreateCustomers < ActiveRecord::Migration[5.2]
  def change
    create_table :customers do |t|
      t.string :name
      t.string  :email
      t.integer  :gender
      t.string :contact_no
      t.boolean    :is_deleted
      t.timestamps
    end
  end
end
