module HttpsResponseHelper

    def self.data_not_found
         return :status => :not_found,
             :json => {
               :status => false,
               :displayMessage => [{ "message": "Data Not Fund" }],
             }
    end

    def self.errors(errors)
        return :status => :unprocessable_entity,
             :json => {
               :status => false,
               :displayMessage => errors,
             }
    end

    def self.deleted_successfully
        return  :status => :accepted,
        :json => {
          :status => true,
          :data => [{ "message": "Data Deleted Successfully" }],
        }
    end
end
