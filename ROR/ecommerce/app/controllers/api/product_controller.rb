class Api::ProductController < ApplicationController
  before_action :set_product, only: [:update, :destroy, :show]
  skip_before_action :authenticate_user!, only: [:index]

  include HttpsResponseHelper

  # GET api/product/1
  def show
    if @product.present?
      render :status => :ok,
             :json => {
               :status => true,
               :data => JSON.parse(@product.to_json(Product.show_product_fields)),
             }
    else
      render HttpsResponseHelper.data_not_found
    end
  end

  # GET api/product
  def index
    @all_product = Product.all
    @product = @all_product.paginate(:page => params[:page] ? params[:page] : 1, :per_page => params[:row_per_page] ? params[:row_per_page] : Rails.application.config.no_of_row_per_page)
    render :status => :ok,
           :json => {
             :status => true,
             :data => JSON.parse(@product.to_json(Product.show_product_fields)),
             :count => @all_product.count,
           }
  end

  # POST api/Product
  def create
    @product = Product.new(product_params)
    if @product.save
      render :status => :created,
             :json => {
               :status => true,
               :data => JSON.parse(@product.to_json(Product.show_product_fields)),
             }
    else
      render HttpsResponseHelper.errors(@product.errors)
    end
  end

  # DELETE api/Product/{{id}}
  def destroy
    if @product.present?
      @product.is_deleted = true
      if @product.save
        render HttpsResponseHelper.deleted_successfully
      else
        render HttpsResponseHelper.errors(@product.errors)
      end
    else
      render HttpsResponseHelper.data_not_found
    end
  end

  # PUT api/Product/{{id}}
  def update
    if @product.present?
      if @product.update(product_params)
        render :status => :accepted,
               :json => {
                 :status => true,
                 :data => JSON.parse(@product.to_json(Product.show_product_fields)),
               }
      else
        render HttpsResponseHelper.errors(@product.errors)
      end
    end
  end

  private

  def product_params
    params.require(:product).permit(:name, :product_code, :category_id, :price, :_destroy)
  end

  def set_product
    @product = Product.find_by(:id => params[:id])
  end
end
