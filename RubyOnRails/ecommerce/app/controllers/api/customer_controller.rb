class Api::CustomerController < ApplicationController
  before_action :set_customer, only: [:update, :destroy, :show]
  skip_before_action :authenticate_user!, only: [:index]

  include HttpsResponseHelper

  # GET api/customer/1
  def show
    if @customer.present?
      render :status => :ok,
             :json => {
               :status => true,
               :data => JSON.parse(@customer.to_json(:only =>[:name, :email, :gender, :contact_no])),
             }
    else
      render HttpsResponseHelper.data_not_found
    end
  end

  # GET api/customer
  def index
    @all_customer = Customer.all.search(params[:q])
    @customer = @all_customer.paginate(:page => params[:page] ? params[:page] : 1, :per_page => params[:row_per_page] ? params[:row_per_page] : Rails.application.config.no_of_row_per_page)
    render :status => :ok,
           :json => {
             :status => true,
             :data => JSON.parse(@customer.to_json(:only =>[:name, :email, :gender, :contact_no])),
             :count => @all_customer.count,
           }
  end

  # POST api/customer
  def create
    @customer = Customer.new(customer_params)
    if @customer.save
      render :status => :created,
             :json => {
               :status => true,
               :data => JSON.parse(@customer.to_json(:only =>[:name, :email, :gender, :contact_no])),
             }
    else
      render HttpsResponseHelper.errors(@customer.errors)
    end
  end

  # DELETE api/customer/{{id}}
  def destroy
    if @customer.present?
      @customer.is_deleted = true
      if @customer.save
        render HttpsResponseHelper.deleted_successfully
      else
        render HttpsResponseHelper.errors(@customer.errors)
      end
    else
      render HttpsResponseHelper.data_not_found
    end
  end

  # PUT api/customer/{{id}}
  def update
    if @customer.present?
      if @customer.update(customer_params)
        render :status => :accepted,
               :json => {
                 :status => true,
                 :data => JSON.parse(@customer.to_json(:only =>[:name, :email, :gender, :contact_no])),
               }
      else
        render HttpsResponseHelper.errors(@customer.errors)
      end
    end
  end

  private

  def customer_params
    params.require(:customer).permit(:name, :email, :gender, :contact_no)
  end

  def set_customer
    @customer = Customer.find_by(:id => params[:id])
  end
end
