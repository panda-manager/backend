import { Controller } from "@nestjs/common"
import { ApiResponse, ApiTags } from "@nestjs/swagger"
import { ErrorResponseDTO } from "modules/user/dto/error_response.dto"
import { CredentialsService } from "./credentials.service"

@ApiResponse({
	status: 401,
	description: 'Unauthorized',
	type: ErrorResponseDTO
})
@ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: ErrorResponseDTO
})
@ApiTags('Credentials')
@Controller('credentials')
export class CredentialsController {
	constructor(private readonly service: CredentialsService) {}
}